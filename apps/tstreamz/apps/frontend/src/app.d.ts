// See https://svelte.dev/docs/kit/types#app

import {IUser} from "@server/models/user"
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
            user?: IUser
        }
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
