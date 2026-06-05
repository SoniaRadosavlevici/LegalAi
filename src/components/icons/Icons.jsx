const defaultProps = { size: 20, className: '', strokeWidth: 1.5 }

const Icon = ({ size, className, strokeWidth, children }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {children}
  </svg>
)

export const Scale = (p = {}) => { const { size, className, strokeWidth } = { ...defaultProps, ...p }; return <Icon {...{ size, className, strokeWidth }}><path d="M12 3l1.9 5.8H20l-5 3.6 1.9 5.8-5-3.6-5 3.6 1.9-5.8-5-3.6h6.1z" /><line x1="12" y1="3" x2="12" y2="21" /></Icon> }

export const FileText = (p = {}) => { const { size, className, strokeWidth } = { ...defaultProps, ...p }; return <Icon {...{ size, className, strokeWidth }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14,2 14,8 20,8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" /></Icon> }

export const Folder = (p = {}) => { const { size, className, strokeWidth } = { ...defaultProps, ...p }; return <Icon {...{ size, className, strokeWidth }}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></Icon> }

export const User = (p = {}) => { const { size, className, strokeWidth } = { ...defaultProps, ...p }; return <Icon {...{ size, className, strokeWidth }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></Icon> }

export const Users = (p = {}) => { const { size, className, strokeWidth } = { ...defaultProps, ...p }; return <Icon {...{ size, className, strokeWidth }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></Icon> }

export const ChevronDown = (p = {}) => { const { size, className, strokeWidth } = { ...defaultProps, ...p }; return <Icon {...{ size, className, strokeWidth }}><polyline points="6,9 12,15 18,9" /></Icon> }

export const ChevronRight = (p = {}) => { const { size, className, strokeWidth } = { ...defaultProps, ...p }; return <Icon {...{ size, className, strokeWidth }}><polyline points="9,18 15,12 9,6" /></Icon> }

export const ChevronLeft = (p = {}) => { const { size, className, strokeWidth } = { ...defaultProps, ...p }; return <Icon {...{ size, className, strokeWidth }}><polyline points="15,18 9,12 15,6" /></Icon> }

export const Search = (p = {}) => { const { size, className, strokeWidth } = { ...defaultProps, ...p }; return <Icon {...{ size, className, strokeWidth }}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></Icon> }

export const Download = (p = {}) => { const { size, className, strokeWidth } = { ...defaultProps, ...p }; return <Icon {...{ size, className, strokeWidth }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7,10 12,15 17,10" /><line x1="12" y1="15" x2="12" y2="3" /></Icon> }

export const Copy = (p = {}) => { const { size, className, strokeWidth } = { ...defaultProps, ...p }; return <Icon {...{ size, className, strokeWidth }}><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></Icon> }

export const Check = (p = {}) => { const { size, className, strokeWidth } = { ...defaultProps, ...p }; return <Icon {...{ size, className, strokeWidth }}><polyline points="20,6 9,17 4,12" /></Icon> }

export const X = (p = {}) => { const { size, className, strokeWidth } = { ...defaultProps, ...p }; return <Icon {...{ size, className, strokeWidth }}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon> }

export const Plus = (p = {}) => { const { size, className, strokeWidth } = { ...defaultProps, ...p }; return <Icon {...{ size, className, strokeWidth }}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Icon> }

export const ArrowRight = (p = {}) => { const { size, className, strokeWidth } = { ...defaultProps, ...p }; return <Icon {...{ size, className, strokeWidth }}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12,5 19,12 12,19" /></Icon> }

export const Shield = (p = {}) => { const { size, className, strokeWidth } = { ...defaultProps, ...p }; return <Icon {...{ size, className, strokeWidth }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></Icon> }

export const Lock = (p = {}) => { const { size, className, strokeWidth } = { ...defaultProps, ...p }; return <Icon {...{ size, className, strokeWidth }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></Icon> }

export const Star = (p = {}) => { const { size, className, strokeWidth } = { ...defaultProps, ...p }; return <Icon {...{ size, className, strokeWidth }}><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2" /></Icon> }

export const MapPin = (p = {}) => { const { size, className, strokeWidth } = { ...defaultProps, ...p }; return <Icon {...{ size, className, strokeWidth }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></Icon> }

export const Phone = (p = {}) => { const { size, className, strokeWidth } = { ...defaultProps, ...p }; return <Icon {...{ size, className, strokeWidth }}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.63 3.39 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16z" /></Icon> }

export const Mail = (p = {}) => { const { size, className, strokeWidth } = { ...defaultProps, ...p }; return <Icon {...{ size, className, strokeWidth }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></Icon> }

export const Globe = (p = {}) => { const { size, className, strokeWidth } = { ...defaultProps, ...p }; return <Icon {...{ size, className, strokeWidth }}><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></Icon> }

export const Building = (p = {}) => { const { size, className, strokeWidth } = { ...defaultProps, ...p }; return <Icon {...{ size, className, strokeWidth }}><rect x="4" y="2" width="16" height="20" rx="2" ry="2" /><line x1="9" y1="22" x2="9" y2="2" /><rect x="12" y="6" width="4" height="4" /><rect x="12" y="14" width="4" height="4" /><rect x="4" y="6" width="1" height="1" /><rect x="4" y="10" width="1" height="1" /><rect x="4" y="14" width="1" height="1" /></Icon> }

export const Calendar = (p = {}) => { const { size, className, strokeWidth } = { ...defaultProps, ...p }; return <Icon {...{ size, className, strokeWidth }}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></Icon> }

export const DollarSign = (p = {}) => { const { size, className, strokeWidth } = { ...defaultProps, ...p }; return <Icon {...{ size, className, strokeWidth }}><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></Icon> }

export const AlertTriangle = (p = {}) => { const { size, className, strokeWidth } = { ...defaultProps, ...p }; return <Icon {...{ size, className, strokeWidth }}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></Icon> }

export const Briefcase = (p = {}) => { const { size, className, strokeWidth } = { ...defaultProps, ...p }; return <Icon {...{ size, className, strokeWidth }}><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></Icon> }

export const Send = (p = {}) => { const { size, className, strokeWidth } = { ...defaultProps, ...p }; return <Icon {...{ size, className, strokeWidth }}><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22,2 15,22 11,13 2,9 22,2" /></Icon> }

export const Eye = (p = {}) => { const { size, className, strokeWidth } = { ...defaultProps, ...p }; return <Icon {...{ size, className, strokeWidth }}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></Icon> }

export const LogOut = (p = {}) => { const { size, className, strokeWidth } = { ...defaultProps, ...p }; return <Icon {...{ size, className, strokeWidth }}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16,17 21,12 16,7" /><line x1="21" y1="12" x2="9" y2="12" /></Icon> }

export const Settings = (p = {}) => { const { size, className, strokeWidth } = { ...defaultProps, ...p }; return <Icon {...{ size, className, strokeWidth }}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></Icon> }

export const Loader = (p = {}) => { const { size, className, strokeWidth } = { ...defaultProps, ...p }; return <Icon {...{ size, className, strokeWidth }}><line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="4.93" y1="4.93" x2="7.76" y2="7.76" /><line x1="16.24" y1="16.24" x2="19.07" y2="19.07" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" /><line x1="4.93" y1="19.07" x2="7.76" y2="16.24" /><line x1="16.24" y1="7.76" x2="19.07" y2="4.93" /></Icon> }

export const CreditCard = (p = {}) => { const { size, className, strokeWidth } = { ...defaultProps, ...p }; return <Icon {...{ size, className, strokeWidth }}><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></Icon> }

export const Filter = (p = {}) => { const { size, className, strokeWidth } = { ...defaultProps, ...p }; return <Icon {...{ size, className, strokeWidth }}><polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3" /></Icon> }

export const Zap = (p = {}) => { const { size, className, strokeWidth } = { ...defaultProps, ...p }; return <Icon {...{ size, className, strokeWidth }}><polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2" /></Icon> }

export const ExternalLink = (p = {}) => { const { size, className, strokeWidth } = { ...defaultProps, ...p }; return <Icon {...{ size, className, strokeWidth }}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15,3 21,3 21,9" /><line x1="10" y1="14" x2="21" y2="3" /></Icon> }
