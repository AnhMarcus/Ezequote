import Cookies from "js-cookie";

const fetchData = async (url, options = {}) => {
  const { method = "GET", body, headers = {} } = options; // Mặc định là GET nếu không có phương thức
  const cookieData = Cookies.get("userloginData");
  console.log(Cookies.get("userloginData"))

  let token = "";

  if (cookieData) {
    try {
      let data = JSON.parse(cookieData);
      token = data.token;
    } catch (e) {
      console.error("Lỗi", e);
    }
  }

  const fetchOptions = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers, // Nếu có header tùy chỉnh thì sẽ được nối thêm vào
      Authorization: "Bearer " + token,
    },
    ...(body && { body: JSON.stringify(body) }), // Chỉ thêm body khi có dữ liệu
  };

  try {
    console.log("📦 Fetching from URL:", url);
    console.log("🔐 Token:", token);
    console.log("📨 Fetch Options:", fetchOptions);
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      throw new Error(`Có lỗi xảy ra: ${response.statusText}`);
    }

    const data = await response.json(); // Lấy dữ liệu JSON từ phản hồi
    return { data, error: null }; // Trả về dữ liệu nếu thành công
  } catch (error) {
    return { data: null, error: error.message }; // Trả về lỗi nếu có
  }
};
export default fetchData;
