export default function WaterMap({ projects = [] }) {
    const topProjects = projects.slice(0, 10);

    return (
        <div className="analytics">
            <div className="analytics-card">
                <h3>📊 ภาพรวมโครงการ</h3>

                <div className="big-number">{projects.length}</div>

                <p>จำนวนโครงการทั้งหมด</p>
            </div>

            <div className="analytics-card">
                <h3>🔥 รายการโครงการ</h3>

                <div className="project-list">
                    {topProjects.map((item, index) => (
                        <div className="project-item" key={index}>
                            <div>#{index + 1}</div>

                            <div>{item.ProjectNameTH}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
