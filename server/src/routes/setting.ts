import { Router } from 'express';
import { post_restaurant_info, post_category, post_menu, post_table_number, post_order } from '../controllers/postData';
import { get_restaurant_info, get_category, get_menus, get_menus_detail, get_table_number, get_search } from '../controllers/getData';
import { delete_category, delete_menu, delete_table_number } from '../controllers/deleteData';
import { update_category, update_menu } from '../controllers/updateData';
import { upload } from "../middleware/uploads";

const router = Router();

router.post("/post_restaurant_info", upload.single("banner"), post_restaurant_info);

router.post("/post_category", post_category);

router.post("/post_menu", post_menu);

router.post("/post_table_number", post_table_number);

router.post("/post_order/:id", post_order)

router.get("/get_restaurant_info", get_restaurant_info);

router.get("/get_category", get_category);

router.get("/get_menus", get_menus);

router.get("/get_menus_detail/:id", get_menus_detail);

router.get("/get_table_number", get_table_number)

router.get("/search", get_search);

router.delete("/delete_category/:id", delete_category);

router.delete("/delete_menu/:id", delete_menu);

router.delete("/delete_table_number/:id", delete_table_number);

router.put("/update_category/:id", update_category);

router.put("/update_menu/:id", upload.single("image"), update_menu);

export default router;