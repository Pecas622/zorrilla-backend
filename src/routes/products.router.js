import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();

const manager = new ProductManager(
    "./src/data/products.json"
);

router.get("/", async (req, res) => {
    const products = await manager.getProducts();
    res.json(products);
});

router.get("/:pid", async (req, res) => {
    const product = await manager.getProductById(
        req.params.pid
    );

    if (!product) {
        return res.status(404).json({
            error: "Producto no encontrado",
        });
    }

    res.json(product);
});

router.post("/", async (req, res) => {
    const product = await manager.addProduct(
        req.body
    );

    res.status(201).json(product);
});

router.put("/:pid", async (req, res) => {
    const product = await manager.updateProduct(
        req.params.pid,
        req.body
    );

    res.json(product);
});

router.delete("/:pid", async (req, res) => {
    await manager.deleteProduct(req.params.pid);

    res.json({
        mensaje: "Producto eliminado",
    });
});

export default router;