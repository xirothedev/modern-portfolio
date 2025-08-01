export {};

export type Roles = "admin" | "moderator";

declare global {
	interface CustomJwtSessionClaims {
		metadata: {
			onboardingComplete?: boolean;
			role?: Roles;
		};
	}
}
