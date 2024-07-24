import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "./../components/Layout";
import moment from "moment";
import { Table } from "antd";


const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    try {
      const res = await axios.get("/api/v1/admin/getAllUsers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getDoctorData = async () => {
    try {
      const res = await axios.get(
        "/api/v1/user/getAllDoctors",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAppointments = async () => {
    try {
      const res = await axios.get("/api/v1/user/user-appointments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setAppointments(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
    getAppointments();
    getDoctorData();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      render: (text, record) => {
        const user = users.find((user) => user._id === record.userId);
        return (
          <span>
            {user ? user.name : "Unknown User"}
          </span>
        );
      },
    },
    {
      title: "Doctor's Name",
      dataIndex: "doctorId",
      render: (text, record) => {
        const doctor = doctors.find((doc) => doc._id === record.doctorId);
        return (
          <span>
            {doctor ? `${doctor.firstName} ${doctor.lastName}` : "Unknown Doctor"}
          </span>
        );
      },
    },
    {
      title: "Date & Time",
      dataIndex: "date",
      render: (text, record) => (
        <span>
          {moment(record.date).format("DD-MM-YYYY")} &nbsp;
          {moment(record.time).format("HH:mm")}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => {
        let statusText = "";
        switch (record.status) {
          case "pending":
            statusText = "Waiting for Doctor's Approval";
            break;
          case "approved":
            statusText = "Doctor approved the appoinment";
            break;
          case "reject":
            statusText = "Doctor rejected the appoinment";
            break;
          default:
            statusText = record.status;
            break;
        }
        return <span>{statusText}</span>;
      },
    },
  ];

  return (
    <Layout>
      <h1 className="text-center m-3">Appoinmtnets Lists</h1>
      <Table columns={columns} dataSource={appointments} />
    </Layout>
  );
};

export default Appointments;
