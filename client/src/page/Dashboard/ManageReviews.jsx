import ManageReviewRow from "../../components/Dashboard/ManageReviewRow";
import { useTheme } from "../../lib/ThemeProvider";
import { useGetAllReviewsQuery } from "../../redux/features/reviewApi";

const ManageReviews = () => {
  const { data } = useGetAllReviewsQuery();
  const { theme } = useTheme(); //* for using light and dark themes
  // console.log(data);

  if (data?.data?.length === 0) {
    return (
      <div className="mt-[25%]">
        <p className="text-center">There is no longer Review here!</p>
      </div>
    );
  }

  return (
    <>
      {data?.data?.length > 0 && (
        <div className="overflow-x-auto">
          <table
            className={`table ${
              theme.mode === "dark" ? "text-gray-100" : "text-gray-800"
            }`}
          >
            {/* head */}
            <thead
              className={`${
                theme.mode === "dark" ? "text-gray-100" : "text-gray-800"
              }`}
            >
              <tr>
                <th>SL</th>
                <th>Reviewer name</th>
                <th>Rating</th>
                <th>Address</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((review, index) => (
                <ManageReviewRow
                  key={review._id}
                  review={review}
                  index={index}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default ManageReviews;
