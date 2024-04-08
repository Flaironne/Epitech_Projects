import { API_URL, headers } from "JQ/services/constants";
import { Petit_Formal_Script } from "next/font/google";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function useLike({ job, isLogged, user }) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (isLogged) {
      fetch(API_URL + "/me/likes?id=true", {
        method: "GET",
        headers: {
          ...headers,
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setIsLiked(data.includes(job));
          setIsLoading(false);
        });
    }
  }, [isLogged, job]);

  async function like(job) {
    console.log(job);
    fetch(`${API_URL}/users/${user.id}/likes`, {
      method: "POST",
      headers: {
        ...headers,
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        job_id: job,
      }),
    }).then((res) => {
      console.log(res);
      if (res.status === 201) {
        setIsLiked(true);
      }
    });
  }

  async function unlike(job) {
    fetch(`${API_URL}/users/${user.id}/likes`, {
      method: "DELETE",
      headers: {
        ...headers,
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        job_id: job,
      }),
    }).then((res) => {
      console.log(res);
      if (res.status === 204) {
        setIsLiked(false);
      }
    });
  }

  return {
    isLiked,
    isLoading,
    like,
    unlike,
  };
}
