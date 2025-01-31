import React, { useEffect, useState } from "react";
import { MdLogout } from "react-icons/md";
import TransactionForm from "../components/ui/TransactionForm";
import Cards from "../components/ui/Cards";

import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "@apollo/client";
import { LOGOUT } from "../graphql/mutations/user.mutation";
import { GET_CATEGORY_STATISTICS } from "../graphql/queries/transaction.query";
import { GET_AUTHENTICATED_USER } from "../graphql/queries/user.query";

Chart.register(ArcElement, Tooltip, Legend);

const HomePage = () => {
	const {data: authenticatedUser} = useQuery(GET_AUTHENTICATED_USER);
  const { data } = useQuery(GET_CATEGORY_STATISTICS);

  console.log("category stats: ", data);

  const [logout, { loading, client }] = useMutation(LOGOUT, {
    refetchQueries: ["getAuthenticatedUser"],
  });
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "$",
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
        borderRadius: 30,
        spacing: 10,
        cutout: 130,
      },
    ],
  });

  useEffect(() => {
    if (data?.categoryStatistics) {

		// console.log("Control is present over here");
      const categories = data.categoryStatistics.map((stat) => stat.category);
      const totalAmount = data.categoryStatistics.map((stat) => stat.totalAmount);

      const backgroundColors = [];
      const borderColors = [];

      categories.forEach((c) => {
        if (c === "saving") {
          backgroundColors.push("rgba(72, 192, 192)");
          borderColors.push("rgba(72, 192, 192)");
        } else if (c === "investment") {
          backgroundColors.push("rgba(54, 132, 165)");
          borderColors.push("rgba(54, 132, 165)");
        } else if (c === "expense") {
          backgroundColors.push("rgba(255, 99, 132)");
          borderColors.push("rgba(255, 99, 132)");
        }
      });

	//   console.log(backgroundColors, borderColors);
      setChartData((prev) => ({
        labels: categories,
        datasets: [
          {
            ...prev.datasets[0],
            data: totalAmount,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
          },
        ],
      }));
    }
  }, [data]);

  const handleLogout = async () => {
    try {
      await logout();
      client.resetStore();
    } catch (error) {
      console.log("Error logging out", error);
      toast.error(error.message);
    }
  };
  return (
    <>
      <div className="flex flex-col gap-6 items-center max-w-7xl mx-auto z-20 relative justify-center">
        <div className="flex items-center">
          <p className="md:text-4xl text-2xl lg:text-4xl font-bold text-center relative z-50 mb-4 mr-4 bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 inline-block text-transparent bg-clip-text">
            Spend wisely, track wisely
          </p>
          <img
            src={authenticatedUser?.authUser.profilePicture}
            className="w-11 h-11 rounded-full border cursor-pointer"
            alt="Avatar"
          />
          {!loading && (
            <MdLogout
              className="mx-2 w-5 h-5 cursor-pointer"
              onClick={handleLogout}
            />
          )}
          {/* loading spinner */}
          {loading && (
            <div className="w-6 h-6 border-t-2 border-b-2 mx-2 rounded-full animate-spin"></div>
          )}
        </div>
        <div className="flex flex-wrap w-full justify-center items-center gap-6">
          <div className="h-[330px] w-[330px] md:h-[360px] md:w-[360px]  ">
            <Doughnut data={chartData} />
          </div>

          <TransactionForm />
        </div>
        <Cards />
      </div>
    </>
  );
};

export default HomePage;
