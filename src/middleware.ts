import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isOnboardingRoute = createRouteMatcher(["/onboarding"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)", "/cms(.*)"]);
const isPublicRoute = createRouteMatcher([
	"/sign-in(.*)",
	"/sign-up(.*)",
	"/",
	"/api(.*)",
	"/repository(.*)",
	"/projects(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
	const { userId, sessionClaims, redirectToSignIn } = await auth();

	// For users visiting /onboarding, don't try to redirect
	if (userId && isOnboardingRoute(req)) {
		return NextResponse.next();
	}

	// If the user isn't signed in and the route is private, redirect to sign-in
	if (!userId && !isPublicRoute(req)) return redirectToSignIn({ returnBackUrl: req.url });

	// Protect admin routes - only users with admin role can access
	if (isAdminRoute(req)) {
		if (!userId) {
			return redirectToSignIn({ returnBackUrl: req.url });
		}

		if (sessionClaims?.metadata?.role !== "admin") {
			const homeUrl = new URL("/", req.url);
			return NextResponse.redirect(homeUrl);
		}
	}

	// Catch users who do not have `onboardingComplete: true` in their publicMetadata
	// Redirect them to the /onboarding route to complete onboarding
	if (userId && !sessionClaims?.metadata?.onboardingComplete && !isAdminRoute(req)) {
		const onboardingUrl = new URL("/onboarding", req.url);
		return NextResponse.redirect(onboardingUrl);
	}

	// If the user is logged in and the route is protected, let them view.
	if (userId && !isPublicRoute(req)) return NextResponse.next();
});

export const config = {
	matcher: [
		"/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|mp4|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|pdf)).*)",
		"/(api|trpc)(.*)",
	],
};
