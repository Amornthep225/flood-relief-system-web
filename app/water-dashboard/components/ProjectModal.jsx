export default function ProjectModal({ project, onClose }) {
    if (!project) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>รายละเอียดโครงการ</h2>

                    <button onClick={onClose}>×</button>
                </div>

                <div className="detail-item">
                    <label>ชื่อโครงการ</label>

                    <p>{project.ProjectNameTH || "-"}</p>
                </div>

                <div className="detail-item">
                    <label>รหัสโครงการ</label>

                    <p>{project.ProjectID || "-"}</p>
                </div>

                <div className="detail-item">
                    <label>คำสำคัญโครงการ</label>

                    <p>{project.ProjectKeyword || "-"}</p>
                </div>

                <div className="detail-item">
                    <label>Keyword (English)</label>

                    <p>{project.ProjectKeywordEng || "-"}</p>
                </div>

                <div className="detail-item">
                    <label>วัตถุประสงค์โครงการ</label>

                    <p>{project.ProjectObjective || "-"}</p>
                </div>

                <div className="detail-item">
                    <label>บทคัดย่อ</label>

                    <p>{project.ProjectAbstract || "-"}</p>
                </div>

                <button className="btn-close" onClick={onClose}>
                    ปิด
                </button>
            </div>
        </div>
    );
}
