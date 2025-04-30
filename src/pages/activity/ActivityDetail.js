import React from "react";
import { useParams } from "react-router-dom";
import "./activityDetail.scss";
import activityData from "../../data/activityData.json";

const ActivityDetail = () => {
  const { activityType } = useParams();
  const activity = activityData[activityType];

  if (!activity) return <h2>Activity không tồn tại.</h2>;

  return (
    <div className="activity-section">
      <div className={`activity-header ${activityType}`} />
      <div className="activity-grid">
        {activity.items.map((item, idx) => (
          <div key={idx} className="activity-card">
            <div className="image-grid">
              {item.images.map((src, i) => (
                <img key={i} src={src} alt={`activity-${i}`} />
              ))}
            </div>
            <div className="activity-info">
              <h2>{item.title}</h2>
              <p className="date">{item.date}</p>
              <p className="desc">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityDetail;
