import { MailCheck, ArrowRight, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

const VerifyMsg = () => {
    return (
        // Main
        <div className="min-h-screen bg-[linear-gradient(135deg,#0F172A_0%,#1E293B_50%,#0F172A_100%)] flex items-center justify-center p-4">

            
            <div className="bg-[#F8FAFC] w-full max-w-2xl rounded-[1.5rem] shadow-2xl border border-[#94A3B8]/20 overflow-hidden flex flex-col md:flex-row">

               
                <div className="bg-[#0F172A] p-8 md:w-1/3 flex items-center justify-center border-b md:border-b-0 md:border-r border-[#F59E0B]/10">
                    <div className="bg-[#10B981]/10 p-4 rounded-full border border-[#10B981]/20">
                        <MailCheck className="w-12 h-12 text-[#10B981]" />
                    </div>
                </div>

                
                <div className="p-8 md:w-2/3 flex flex-col justify-center space-y-4">
                    <div className="space-y-2">
                        <h2 className="text-[#020617] text-2xl font-black tracking-tighter uppercase">
                            Verify <span className="text-[#F59E0B]">Email</span>
                        </h2>
                        <p className="text-[#94A3B8] text-xs font-medium leading-relaxed">
                            We've sent a verification link to your inbox. 
                            Please check and activate your account.
                        </p>
                    </div>

                   
                    <div className="pt-2">
                        <p className="text-[#0F172A] text-[10px] font-bold uppercase tracking-wider mb-2">
                            After verifying your email, click below:
                        </p>
                        <Link 
                            to="/login" 
                            className="inline-flex items-center justify-center gap-2 bg-[#F59E0B] text-[#020617] px-6 py-2.5 rounded-lg font-black text-xs uppercase tracking-widest hover:bg-[#0F172A] hover:text-[#F8FAFC] transition-all shadow-md active:scale-95"
                        >
                            Go to Sign In <LogIn className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Footer Info */}
                    <div className="pt-4 border-t border-[#94A3B8]/10 flex flex-col gap-3">
                        
                        
                        <Link to="/signup" className="inline-flex items-center gap-1.5 text-[#0F172A] text-[10px] font-black uppercase tracking-widest hover:text-[#F59E0B] transition-colors">
                            <ArrowRight className="w-3 h-3 rotate-180" /> Back to Signup
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default VerifyMsg;