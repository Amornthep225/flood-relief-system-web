import { colors } from "@/constants/colors";

export default function SosFormHeader() {
    return (
        <div className="text-center mb-8">
            <h1 className={`${colors.requestFormSos.primaryText} text-3xl font-bold mb-2`}>
                แจ้งความประสงค์ขอรับสิ่งของบรรเทาทุกข์
            </h1>

            <p className={colors.requestFormSos.secondaryText}>
                โปรดระบุรายละเอียดความต้องการเพื่อให้เจ้าหน้าที่เข้าช่วยเหลือได้ตรงจุด
            </p>
        </div>
    );
}