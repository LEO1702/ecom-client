import {
  Box,
  Divider,
  Grid,
  ListItem,
  Text,
  UnorderedList,
  useToast,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { numberWithCommas, setToast } from "../utils/extraFunctions";
import { ImageModal } from "../components/description/ImageModal";
import { SelectSize } from "../components/description/SelectSize";
import { NewButton } from "../components/description/NewButton";
// import { getItemSession } from "../utils/sessionStorage";
// import { addToCartRequest } from "../redux/features/cart/actions";
import { useEffect, useState } from "react";
// import { addToFavouriteRequest } from "../redux/features/favourite/actions";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Loading } from "../components/loading/Loading";
import { Error } from "../components/loading/Error";

function Description() {
  useEffect(() => {
    getSingleProduct();
  }, []);

  const location = useLocation();
  const [mySize, setMySize] = useState(false);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const param = useParams();
  const token = useSelector((state) => state.auth.token);
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    if (mySize === false) {
      setToast(toast, "Please select a Size", "error");
    } else {
      const payload = { ...data, size: mySize, quantity: 1 };
      //   dispatch(addToCartRequest(payload, toast));
      navigate("/cart");
    }
  };

  const handleAddToFavourite = () => {
    if (!token) {
      setToast(toast, "Please login first", "error");
      navigate("/auth");
    } else {
      //   dispatch(addToFavouriteRequest(data, token, toast));
    }
  };

  const getSingleProduct = async () => {
    setLoading(true);
    try {
      let res = await axios.get(`/product/getsingleproduct/${param.id}`);
      let res1 = await res.data;
      setData(res.data);
      setLoading(false);
    } catch (error) {
      console.log("error", error);
      setError(true);
      setToast(toast, "Product Not Found", "error");
      navigate(-1, { replace: true })
    }
  };

  return loading ? (
    <Loading />
  ) : error ? (
    <Error />
  ) : (
    <Grid
      p={"10px"}
      gap={["40px", "40px", "4%", "4%", "4%"]}
      templateColumns={["100%", "100%", "55% 41%", "62% 34%", "62% 34%"]}
      w={["100%", "100%", "100%", "100%", "90%"]}
      m={[
        "40px auto 100px",
        "40px auto 100px",
        "40px auto 60px",
        "40px auto 60px",
        "40px auto 60px",
      ]}
    >
      <ImageModal img={data?.img} />

      <Box px={["20px", "40px"]}>
        <Text fontSize={"29px"}>{data?.title}</Text>
        <Text>{data?.description}</Text>
        <Text fontSize={"22px"} mt="20px">
          ₹ {numberWithCommas(+data?.price)}
        </Text>
        <Text color={"gray"}>incl. of taxes and duties</Text>
        <Text fontSize={"18px"} mt={"30px"} mb={"10px"}>
          Select Size
        </Text>
        <Box mb={"30px"}>
          <SelectSize size={data?.size} setMySize={setMySize} />
        </Box>

        <NewButton
          click={handleAddToCart}
          name={"Add to Bag"}
          bgColor={"black"}
          color={"white"}
          hoverBg={"#1e1e1e"}
          borderColor={"transparent"}
        />
        <NewButton
          click={handleAddToFavourite}
          name={"Favourite"}
          bgColor={"white"}
          color={"black"}
          hoverBorder={"black"}
          borderColor={"#cecdce"}
        />

        <Divider my={"30px"} />

        <Text fontSize={"18px"} mb={"10px"} textDecoration={"underline"}>
          Product Deatils
        </Text>
        <UnorderedList fontSize={"18px"}>
          <ListItem>Gender: {data?.gender}</ListItem>
          <ListItem>Category: {data?.category}</ListItem>
          <ListItem>Colour: {data?.color}</ListItem>
          <ListItem>Rating: {data?.rating}</ListItem>
        </UnorderedList>
      </Box>
    </Grid>
  );
}
export default Description;
