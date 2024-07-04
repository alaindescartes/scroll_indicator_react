import React, { useEffect, useState } from "react";

function Scroll() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to load data: " + error.message);
        setLoading(false);
      });
  }, []);

  // Handling scroll event with throttling using requestAnimationFrame
  useEffect(() => {
    let animationFrameId = null;
    const handleScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const height =
          document.documentElement.scrollHeight -
          document.documentElement.clientHeight;
        const scrolled = (scrollTop / height) * 100;
        setProgress(scrolled);
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {data.map((item) => (
        <div key={item.id} className="post">
          <h1 className="post-title">{item.title}</h1>
          <p className="user-id">
            <strong>User ID:</strong> {item.userId}
          </p>
          <p className="post-body">{item.body}</p>
        </div>
      ))}
      <div
        style={{
          position: "fixed",
          top: 0,
          width: `${progress}%`,
          height: "5px",
          backgroundColor: "blue",
        }}
      >
        Scroll Progress: {progress.toFixed(2)}%
      </div>
    </div>
  );
}

export default Scroll;
