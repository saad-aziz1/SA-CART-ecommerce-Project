
import { MailCheck, ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const VerifyMsg = () => {
    return (
        // Topic 1: Same Gradient Background as SignUp
        <div className="min-h-screen bg-[linear-gradient(135deg,#1E293B_0%,#334155_50%,#1E293B_100%)] flex items-center justify-center p-4">

            {/* Topic 2: Verification Card */}
            <div className="bg-[#F8FAFC] w-full max-w-md rounded-[2rem] shadow-2xl border border-[#94A3B8]/20 overflow-hidden text-center">

                {/* Header Section */}
                <div className="bg-[#0F172A] p-10 flex justify-center">
                    {/* Success Icon with Glowing Effect */}
                    <div className="bg-[#10B981]/10 p-5 rounded-full border-2 border-[#10B981]/20">
                        <MailCheck className="w-16 h-16 text-[#10B981]" />
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-8 md:p-12 space-y-6">
                    <h2 className="text-[#020617] text-3xl font-black tracking-tighter uppercase">
                        Check Your <span className="text-[#F59E0B]">Email</span>
                    </h2>

                    <p className="text-[#94A3B8] text-sm font-medium leading-relaxed">
                        We have sent a <span className="text-[#0F172A] font-bold">verification link</span> to your email address.
                        Please click on that link to activate your account.
                    </p>

                    {/* Action Button: User ko email par bhejne ke liye (Visual only) */}
                    <button className="w-full bg-[#0F172A] text-[#F8FAFC] py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-[#F59E0B] hover:text-[#020617] transition-all flex items-center justify-center gap-2 group">
                        Open Email Inbox <ExternalLink className="w-4 h-4" />
                    </button>

                    {/* Footer Info */}
                    <div className="pt-6 border-t border-[#94A3B8]/20">
                        <p className="text-xs text-[#94A3B8] font-medium">
                            Email nahi mili? <button className="text-[#F59E0B] font-bold hover:underline">Resend Link</button>
                        </p>

                        <Link to="/signup" className="inline-flex items-center gap-2 mt-6 text-[#0F172A] text-xs font-black uppercase tracking-widest hover:text-[#F59E0B] transition-colors">
                            Back to Signup <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default VerifyMsg;