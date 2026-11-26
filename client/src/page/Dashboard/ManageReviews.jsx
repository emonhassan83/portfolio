import ManageReviewRow from "../../components/Dashboard/ManageReviewRow";
import { useGetAllReviewsQuery } from "../../redux/features/reviewApi";

const ManageReviews = () => {
  const { data } = useGetAllReviewsQuery();
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
            className={`table text-base-content`}
          >
            {/* head */}
            <thead
              className={`text-base-content`}
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
