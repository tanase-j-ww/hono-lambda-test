import { z } from "@hono/zod-openapi";

import type { ResponseConfig } from "@asteasolutions/zod-to-openapi/dist/openapi-registry";

const createErrorSchema = ({
	statusCode,
	errorMessage,
}: {
	statusCode: number;
	errorMessage: string;
}) => {
	return z.object({
		status: z.number().openapi({
			title: "HTTPステータスコード",
			description: "HTTPステータスコードです。",
			example: statusCode,
		}),
		message: z.string().max(255).openapi({
			title: "エラーメッセージ",
			description: "エラーメッセージです。",
			example: errorMessage,
		}),
	});
};

const BadRequestErrorSchema = createErrorSchema({
	statusCode: 400,
	errorMessage: "Bad Request",
});

const UnauthorizedErrorSchema = createErrorSchema({
	statusCode: 401,
	errorMessage: "Unauthorized",
});

const ForbiddenErrorSchema = createErrorSchema({
	statusCode: 403,
	errorMessage: "Forbidden",
});

const NotFoundErrorSchema = createErrorSchema({
	statusCode: 404,
	errorMessage: "Not Found",
});

const InternalServerErrorSchema = createErrorSchema({
	statusCode: 500,
	errorMessage: "Internal Server Error",
});

export const BAD_REQUEST_ERROR: ResponseConfig = {
	content: {
		"application/json": {
			schema: BadRequestErrorSchema,
		},
	},
	description: "Bad Request",
};

export const UNAUTHORIZED_ERROR: ResponseConfig = {
	content: {
		"application/json": {
			schema: UnauthorizedErrorSchema,
		},
	},
	description: "Unauthorized",
};

export const FORBIDDEN_ERROR: ResponseConfig = {
	content: {
		"application/json": {
			schema: ForbiddenErrorSchema,
		},
	},
	description: "Forbidden",
};

export const NOT_FOUND_ERROR: ResponseConfig = {
	content: {
		"application/json": {
			schema: NotFoundErrorSchema,
		},
	},
	description: "Not Found",
};

export const INTERNAL_SERVER_ERROR: ResponseConfig = {
	content: {
		"application/json": {
			schema: InternalServerErrorSchema,
		},
	},
	description: "Internal Server Error",
};
