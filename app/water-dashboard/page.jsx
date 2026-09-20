"use client";

import { useMemo, useState } from "react";
import useWaterProjects from "./hooks/useWaterProjects";
import StatCard from "./components/StatCard";
import ProjectTable from "./components/ProjectTable";
import WaterAnalytics from "./components/WaterAnalytics";
import SearchFilter from "./components/SearchFilter";
import ProjectModal from "./components/ProjectModal";
export default function Dashboard() {

    const { projects, loading, error } = useWaterProjects();

    const [keyword, setKeyword] = useState("");
    const [selected, setSelected] = useState(null);
    const [page, setPage] = useState(1);

    const perPage = 20;

    const filtered = useMemo(() => projects.filter(x => {
        const text = `${x.ProjectNameTH || ""} ${x.ProjectID || ""}`.toLowerCase();
        return text.includes(keyword.toLowerCase());
    }), [projects, keyword]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));

    const rows = filtered.slice((page - 1) * perPage, page * perPage);

    if (loading) return <div className="page">กำลังโหลดข้อมูล...</div>;
    if (error) return <div className="page">ไม่สามารถโหลด API ได้</div>;

    return (
        <div className="page">

            <header className="navbar">
                <h1>💧 Water Management Dashboard</h1>
                <p>ระบบติดตามโครงการบริหารจัดการน้ำ</p>
            </header>

            <section className="cards">
                <StatCard title="โครงการทั้งหมด" value={projects.length} />
                {/* <StatCard title="หน้าปัจจุบัน" value={`${page}/${totalPages}`} /> */}
            </section>

            {/* <div className="panel">
                <WaterAnalytics projects={projects} />
            </div> */}

            <div className="panel">

                <SearchFilter
                    keyword={keyword}
                    setKeyword={(v) => { setKeyword(v); setPage(1) }}
                />

                <ProjectTable
                    projects={rows}
                    onSelect={setSelected}
                />

                <div className="pagination">

                    <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
                        ก่อนหน้า
                    </button>

                    <span>{page} / {totalPages}</span>

                    <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                        ถัดไป
                    </button>

                </div>

            </div>

            <ProjectModal
                project={selected}
                onClose={() => setSelected(null)}
            />

        </div>
    )
}