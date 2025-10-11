import { generateLinkedInAuthUrl, handleLinkedInLogin, generateToken ,  } from "src/services/authService.js";



export const redirectToLinkedIn = (req, res) => {
    try {
        const { userType } = req.query;
        if (!userType) {
            return res.status(400).json({ message: 'userType is required for LinkedIn signup.' });
        }

        const linkedInAuthUrl = generateLinkedInAuthUrl({ userType });

        res.redirect(linkedInAuthUrl);
    } catch (error) {
        console.error("Error redirecting to LinkedIn:", error);
        res.status(500).send("An error occurred while redirecting to LinkedIn.");
    }
};

export const handleLinkedInCallback = async (req, res) => {
    try {
        const { code, state, error, error_description } = req.query;

        if (error) {
            return res.status(400).json({ message: `LinkedIn authentication failed: ${error_description || error}` });
        }

        const { user, isNewUser } = await handleLinkedInLogin({ code, state });

        const token = generateToken({
            userId: user._id, 
            email: user.email,
            userType: user.userType
        });
        
        
        const onboardingRoutes = {
            candidate: '/student-form', fresher: '/student-form', professional: '/student-form',
            company: '/company-form', college: '/college-onboarding', employer: '/onboardingflowForm'
        };
        const dashboardRoutes = {
            student: '/home', fresher: '/fresherhome', professional: '/Profhome',
            company: '/home', college: '/home', employer: '/home'
        };

        const targetRoute = isNewUser
            ? onboardingRoutes[user.userType] || '/onboarding'
            : dashboardRoutes[user.userType] || '/home';

       
        const redirectUrl = `${process.env.Frontend_URL}${targetRoute}?token=${token}&email=${encodeURIComponent(user.email)}&name=${encodeURIComponent(user.name || '')}&userType=${user.userType}&profileImage=${encodeURIComponent(user.profileImage || '')}`;

        res.redirect(redirectUrl);

    } catch (err) {
        console.error("LinkedIn callback error:", err.response?.data || err.message);
        const errorMsg = encodeURIComponent(err.response?.data?.message || 'LinkedIn auth failed on server.');
        res.redirect(`${process.env.Frontend_URL}/signup?error=${errorMsg}`);
    }
};