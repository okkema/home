import { sequence } from "astro:middleware"
import { authenticate, authorize, error, login, router } from "@okkema/worker/web"

export const onRequest = router({
    "*": error,
    "/edit/*": sequence(login, authenticate),
    "/edit/save": authorize("write:settings")
})