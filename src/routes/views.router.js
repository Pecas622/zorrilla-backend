import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("home", { title: "Home", products });
  } catch (error) {
    res.status(500).render("home", { title: "Home", products: [], error: error.message });
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("realTimeProducts", { title: "Real Time Products", products });
  } catch (error) {
    res
      .status(500)
      .render("realTimeProducts", { title: "Real Time Products", products: [], error: error.message });
  }
});

export default router;
