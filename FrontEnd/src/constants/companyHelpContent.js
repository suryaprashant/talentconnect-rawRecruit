import {
  Home,
  Bookmark,
  LayoutDashboard,
  Wrench,
  FileText,
  Megaphone,
  Briefcase,
  CheckCircle,
  Users,
  MessageCircle
} from "lucide-react";

export const companyHelpContent = {
  home: {
    title: "Home",
    icon: Home,
    description: "Quick snapshot of your hiring activity, application status, and service requests.",
  },
  saved: {
    title: "Saved Opportunities",
    icon: Bookmark,
    description: "Jobs and opportunities you’ve saved to review or apply later.",
  },
  companyDashboard: {
    title: "Company Dashboard",
    icon: LayoutDashboard,
    description: "Browse and apply to all on-campus and pool-campus opportunities posted by colleges.",
  },
  serviceRequest: {
    title: "Service Request",
    icon: Wrench,
    description: "Request workforce solutions, training programs, or branding services.",
  },
  applicationStatus: {
    title: "Application Status",
    icon: FileText,
    description: "Track the status of all your on-campus and pool-campus applications.",
  },
  hiringChannels: {
    title: "Hiring Channels",
    icon: Megaphone,
    description: "Create and post on-campus, pool-campus, and off-campus hiring opportunities.",
  },
  jobManagement: {
    title: "Job Management",
    icon: Briefcase,
    description: "Review, shortlist, accept, or reject applications across all hiring channels.",
  },
  shortlisted: {
    title: "Shortlisted",
    icon: CheckCircle,
    description: "Schedule meetings, chat, and proceed with shortlisted candidates or colleges.",
  },
  accepted: {
    title: "Accepted",
    icon: Users,
    description: "View confirmed hires and accepted on-campus or pool-campus colleges.",
  },
  chats: {
    title: "Chats",
    icon: MessageCircle,
    description: "Communicate directly with colleges, candidates, and hiring partners.",
  },
};
// // constants/companyHelpContent.js
// export const companyHelpContent = {
//   home: {
//     title: "🏠 Home",
//     description: "Quick snapshot of your hiring activity, application status, and service requests.",
//   },
//   saved: {
//     title: "⭐ Saved Opportunities",
//     description: "Jobs and opportunities you’ve saved to review or apply later.",
//   },
//   companyDashboard: {
//     title: "🏢 Company Dashboard",
//     description: "Browse and apply to all on-campus and pool-campus opportunities posted by colleges.",
//   },
//   serviceRequest: {
//     title: "🛠 Service Request",
//     description: "Request workforce solutions, training programs, or branding services.",
//   },
//   applicationStatus: {
//     title: "📄 Application Status",
//     description: "Track the status of all your on-campus and pool-campus applications.",
//   },
//   hiringChannels: {
//     title: "📢 Hiring Channels",
//     description: "Create and post on-campus, pool-campus, and off-campus hiring opportunities.",
//   },
//   jobManagement: {
//     title: "🗂 Job Management",
//     description: "Review, shortlist, accept, or reject applications across all hiring channels.",
//   },
//   shortlisted: {
//     title: "⭐ Shortlisted Candidates / Colleges",
//     description: "Schedule meetings, chat, and proceed with shortlisted candidates or colleges.",
//   },
//   accepted: {
//     title: "✅ Accepted Candidates / Colleges",
//     description: "View confirmed hires and accepted on-campus or pool-campus colleges.",
//   },
//   chats: {
//     title: "💬 Chats",
//     description: "Communicate directly with colleges, candidates, and hiring partners.",
//   },
// };