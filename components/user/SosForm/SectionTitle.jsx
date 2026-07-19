import { colors } from "@/constants/colors";

export default function SectionTitle({ number, title }) {
    return (
        <div className="flex items-center gap-3">
            <div className={`${colors.requestFormSos.accentBg} ${colors.requestFormSos.accentText} w-8 h-8 rounded-full flex items-center justify-center font-bold`}>
                {number}
            </div>

            <h3 className="text-lg font-bold text-slate-700">
                {title}
            </h3>
        </div>
    );
}