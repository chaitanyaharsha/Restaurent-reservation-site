import React from "react";
import { useAuthStore } from "../../../store/useAuthStore";
import { useStockRequestCountForUser } from "../../../hooks/useStockRequestData";

const Dashboard = () => {
  const { user } = useAuthStore((state) => ({
    user: state.user,
  }));
  // Get the data from the react-query hook
  const { data: stockRequestData } = useStockRequestCountForUser();
  //
  return (
    <div className="container mt-4">
      {user && (
        <div className="alert alert-primary" role="alert">
          You are logged in as <strong>{user.role}</strong>
        </div>
      )}

      <div className="row">
        <div className="col-md-3 mb-4">
          <div className="card text-center h-100">
            <div className="card-body">
              {/* Total Requests */}
              <h5 className="card-title">💢 Total Requests</h5>
              <p className="card-text fs-4 fw-bold">
                {/* show count */}
                {stockRequestData?.data?.stockRequests.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
