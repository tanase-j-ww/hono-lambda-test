import type { Context } from "hono";

type JSONValue = string | number | boolean | null | { [x: string]: JSONValue } | JSONValue[];

type ControllerArgs = {
	path: { [x: string | number | symbol]: string };
	query: { [x: string | number | symbol]: string };
	// biome-ignore lint/suspicious/noExplicitAny: HACK
	body?: any;
};

// 汎用的な handlerGenerator を作成
export const handlerGenerator = <R extends JSONValue>(
	controllerMethod: ({ path, query, body }: ControllerArgs) => Promise<R>,
) => {
	return async (c: Context) => {
		try {
			let args: ControllerArgs = { path: {}, query: {} };

			// パスパラメータがある場合、それを取り出す
			if (c.req.param) {
				const params = c.req.param();
				args = { ...args, path: params };
			}

			// クエリパラメータがある場合、それを取り出す
			if (c.req.query) {
				const query = c.req.query();
				args = { ...args, query };
			}

			// リクエストボディがある場合、それを取り出してバリデーション
			if (c.req.json) {
				try {
					const body = await c.req.json();
					if (body) {
						args.body = body;
					}
				} catch (e: unknown) {
					if (e instanceof Error && e.name === "SyntaxError") {
						console.warn(`Failed to parse JSON or empty Body, ${e}`);
					} else {
						console.error(e);
					}
				}
			}

			// controllerMethod を実行して結果を取得
			const result = await controllerMethod(args);

			// 結果をレスポンスとして返す
			return c.json(result);
		} catch (error) {
			// エラーハンドリング (適切なエラーレスポンスを返す)
			console.error(error);
			return c.json({ message: "Internal Server Error", stack: error }, 500);
		}
	};
};
