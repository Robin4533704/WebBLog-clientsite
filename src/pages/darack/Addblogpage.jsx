import AddBlog from "../../components/AddBlog";
import useAuth from "../provider/useAuth";

const AddBlogPage = () => {
  const { user } = useAuth(); // user: { email, fullName }

  return <AddBlog user={user} />;
};

export default AddBlogPage;
