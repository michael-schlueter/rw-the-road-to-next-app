export const homePath = () => "/";

export const ticketsPath = () => "/tickets";
export const ticketsByOrganizationPath = () => "/tickets/organization";
export const ticketPath = (ticketId: string) => `/tickets/${ticketId}`;
export const ticketEditPath = (ticketId: string) => `/tickets/${ticketId}/edit`;

export const commentEditPath = (ticketId: string, commentId: string) =>
  `/tickets/${ticketId}//comments/${commentId}/edit`;

export const signUpPath = () => "/sign-up";
export const signInPath = () => "/sign-in";
export const passwordForgotPath = () => "/password-forgot";
export const passwordResetPath = () => "/password-reset";
export const emailResetPath = () => "/email-reset";
export const emailVerificationPath = () => "/email-verification";
export const emailInvitationPath = () => "/email-invitation";

export const onboardingPath = () => "/onboarding";
export const selectActiveOrganizationPath = () =>
  "/onboarding/select-active-organization";

export const organizationsPath = () => "/organization";
export const organizationCreatePath = () => "/organization/create";

export const membershipsPath = (organizationId: string) =>
  `/organization/${organizationId}/memberships`;
export const invitationsPath = (organizationId: string) =>
  `/organization/${organizationId}/invitations`;
export const credentialsPath = (organizationId: string) =>
  `/organization/${organizationId}/credentials`;
export const subscriptionPath = (organizationId: string) =>
  `/organization/${organizationId}/subscription`;

export const accountProfilePath = () => "/account/profile";
export const accountPasswordPath = () => "/account/password";
export const accountEmailPath = () => "/account/email";

export const attachmentDownloadPath = (attachmentId: string) =>
  `/api/aws/s3/attachments/${attachmentId}`;

export const pricingPath = () => "/pricing";
