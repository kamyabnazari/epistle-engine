import { z } from 'zod';

export const registerSchema = z
	.object({
		name: z.string().min(1),
		email: z.string().email(),
		password: z.string().min(9),
		passwordConfirm: z.string().min(9)
	})
	.refine((data) => data.password === data.passwordConfirm, {
		message: 'Passwords do not match',
		path: ['passwordConfirm']
	});

export const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(9)
});

export const changeEmailSchema = z.object({
	email: z.string().email(),
	newEmail: z.string().email(),
	password: z.string().min(9)
});

export const resetPasswordSchema = z.object({
	email: z.string().email()
});

export const profileSchema = z.object({
	name: z.string().min(1),
	avatar: z.any().optional()
});
