import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ViewjobApplicants() {
  const { id } = useParams();
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    const fetchApplicants = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const res = await axios.get(`/api/job/applicants/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setApplicants(res.data);
      } catch (err) {
        console.error("Error fetching applicants:", err);
      }

    };
    fetchApplicants();
  }, [id]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Applicants for Job {id}</h1>

      {applicants.length > 0 ? (
        <ul className="space-y-2">
          {applicants.map((applicant) => (
            <li
              key={applicant._id}
              className="p-3 border rounded shadow bg-gray-50"
            >
              {applicant.fullName} — {applicant.email}
            </li>
          ))}
        </ul>
      ) : (
        <p>No applicants yet.</p>
      )}
    </div>
  );
}

export default ViewjobApplicants;
