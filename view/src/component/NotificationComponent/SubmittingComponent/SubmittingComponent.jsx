import React from "react"
import "./SubmittingComponent.css"

const component = (props)=>{
    return (
        (props.type === "loading")?
        <div className="notification-submitting loading">
                <span className="fas fa-spinner spinning"></span> Sedang menyimpan data, Anda dapat melanjutkan ke soal selanjutnya...
        </div>
        :
        (props.type === "success")?
        <div className="notification-submitting success">
                <span className="fas fa-check"></span> Jawaban berhasil disimpan!
        </div>
        :
        <div className="notification-submitting error">
                <span className="fas fa-check"></span> Terjadi kesalahan, hubungi proktor / pengawas ujian!
        </div>
    )
}

export default component;