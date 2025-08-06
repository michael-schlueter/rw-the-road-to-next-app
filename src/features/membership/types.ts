import { Membership } from "@prisma/client";

export type MembershipWithUser = Membership & {
    user: {
        email: string;
        username: string;
        emailVerified: boolean;
    }
};