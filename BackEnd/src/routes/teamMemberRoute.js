import express from 'express';
import secureRoute from '../middlewares/secureRouteMiddleware.js';
import { acceptInvitation, declineInvitation, getCompanyMember, getMyActiveCompanies, getPendingInvitations, getTeamMembers, inviteTeamMember, leaveCompany, removeTeamMember, searchEmployers, switchActiveProfile } from '../controllers/teamMemberController.js';
import {
    searchLimiter,
    applicationLimiter,
    adminLimiter,
    deleteAccountLimiter,
} from "../middlewares/ratelimiter/index.js";

const router = express.Router();

// ============================================================
// Team Member Routes
// ============================================================

// GET search employers - uses searchLimiter (60 per minute)
router.get(
    '/search-employers',
    secureRoute,
    searchLimiter,
    searchEmployers
);

// POST invite team member - uses applicationLimiter (30 per hour)
router.post(
    '/invite',
    secureRoute,
    applicationLimiter,
    inviteTeamMember
);

// POST accept invitation - uses applicationLimiter (30 per hour)
router.post(
    '/accept-invitation',
    secureRoute,
    applicationLimiter,
    acceptInvitation
);

// GET list team members - uses searchLimiter (60 per minute)
router.get(
    '/list-members',
    secureRoute,
    searchLimiter,
    getTeamMembers
);

// GET pending invitations - uses searchLimiter (60 per minute)
router.get(
    '/pending-invitations',
    secureRoute,
    searchLimiter,
    getPendingInvitations
);

// GET my active companies - uses searchLimiter (60 per minute)
router.get(
    '/my-companies',
    secureRoute,
    searchLimiter,
    getMyActiveCompanies
);

// POST switch active profile - uses profileUpdateLimiter (30 per hour)
router.post(
    '/switch-profile',
    secureRoute,
    applicationLimiter,
    switchActiveProfile
);

// GET companies member - uses searchLimiter (60 per minute)
router.get(
    '/companies-member',
    secureRoute,
    searchLimiter,
    getCompanyMember
);

// DELETE leave company - uses deleteAccountLimiter (2 per day)
router.delete(
    '/leave/:companyId',
    secureRoute,
    deleteAccountLimiter,
    leaveCompany
);

// DELETE remove team member - uses deleteAccountLimiter (2 per day)
router.delete(
    '/remove/:memberId',
    secureRoute,
    deleteAccountLimiter,
    removeTeamMember
);

// POST decline invitation - uses applicationLimiter (30 per hour)
router.post(
    '/invitations/:id/decline',
    secureRoute,
    applicationLimiter,
    declineInvitation
);

export default router;