import { useState, useEffect } from 'react';
import { Search, Eye, ChevronLeft, ChevronRight, Trash, Calendar, MapPin, Users, Clock, Edit, Trash2, Send } from 'lucide-react';
import { getCompanyHackathonsWithRegistrations, getCompanyCasestudiesWithRegistrations, getCompanyWorkshopsWithRegistrations, deleteHackathon, deleteCasestudy, deleteWorkshop, sendFileToHackathonUsers, sendFileToCasestudyUsers, sendFileToWorkshopUsers } from '@/lib/Company_AxiosInstance';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import HackathonApplicantDetails from './HackathonApplicantDetails';
import CasestudyApplicantDetails from './CasestudyApplicantDetails';
import WorkshopApplicantDetails from './WorkshopApplicantDetails';
