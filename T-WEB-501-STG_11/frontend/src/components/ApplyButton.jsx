import { useState } from "react";
import useAuth from "JQ/hooks/auth";
import { API_URL } from "JQ/services/constants";
import Swal from "sweetalert2";
import Loading from "./Loading";

export default function ApplyButton({
  className,
  title = null,
  content,
  jobId,
}) {
  const { isLogged, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const url = API_URL + `/job/${jobId}/applications`;

  function toggleForm() {
    Swal.fire({
      title: "Apply to this job",
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="Firstname">' +
        '<input id="swal-input2" class="swal2-input" placeholder="Lastname">' +
        '<input type="email" id="swal-input3" class="swal2-input" placeholder="Email">' +
        '<input id="swal-input4" class="swal2-input" placeholder="Phone number">',
      focusConfirm: false,
      confirmButtonText: "Apply",
      confirmButtonColor: "#2c3e50",
      showCloseButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return new Promise((resolve) => {
          let [firstname, lastname, email, phone] = [
            document.getElementById("swal-input1").value,
            document.getElementById("swal-input2").value,
            document.getElementById("swal-input3").value,
            document.getElementById("swal-input4").value,
          ];

          fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              firstname: firstname,
              lastname: lastname,
              email: email,
              phone: phone,
              user_id: null,
            }),
          })
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              if (data.success == true) {
                Swal.fire({
                  icon: "success",
                  title: "Success!",
                  text: "Your application has been sent!",
                });
              } else {
                Swal.showValidationMessage(
                  "Please be sure to fill all fields."
                );
              }
              resolve();
            });
        });
      },
    });
  }

  function applyjob() {
    setLoading(true);
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: user.id }),
    })
      .then((response) => {
        return response.json();
      })
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Your application has been sent!",
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Network error:", error);
      });
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <button
          className={className}
          title={title}
          onClick={loading ? null : isLogged ? applyjob : () => toggleForm()}
        >
          {className == "card__apply" ? "Apply" : content}
        </button>
      )}
    </>
  );
}
