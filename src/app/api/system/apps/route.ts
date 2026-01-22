import { APP_REGISTRY } from "@/src/core/apps/registry";

export async function GET() {
    return Response.json(
        Object.values(APP_REGISTRY).map((app) => ({
            id: app.id,
            title: app.title,
            icon: app.icon,
            showInDock: app.showInDock ?? false,
            showOnDesktop: app.showOnDesktop ?? false,
            window: app.window,
        })),
    );
}
