import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_PATH = path.join(__dirname, "..", "data", "products.json");

export default class ProductManager {
  constructor(filePath = DEFAULT_PATH) {
    this.path = filePath;
  }

  async #readFile() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      if (error.code === "ENOENT") return [];
      throw error;
    }
  }

  async #writeFile(products) {
    await fs.writeFile(this.path, JSON.stringify(products, null, 2), "utf-8");
  }

  async getProducts() {
    return this.#readFile();
  }

  async getProductById(id) {
    const products = await this.#readFile();
    const product = products.find((p) => p.id === Number(id));
    return product || null;
  }

  async addProduct(productData) {
    const {
      title,
      description,
      code,
      price,
      stock,
      category,
      status = true,
      thumbnails = [],
    } = productData;

    if (
      !title ||
      !description ||
      !code ||
      price === undefined ||
      stock === undefined ||
      !category
    ) {
      throw new Error("Faltan campos obligatorios para crear el producto");
    }

    const products = await this.#readFile();

    const newId =
      products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;

    const newProduct = {
      id: newId,
      title,
      description,
      code,
      price: Number(price),
      stock: Number(stock),
      category,
      status: Boolean(status),
      thumbnails: Array.isArray(thumbnails) ? thumbnails : [],
    };

    products.push(newProduct);
    await this.#writeFile(products);

    return newProduct;
  }

  async deleteProduct(id) {
    const products = await this.#readFile();
    const index = products.findIndex((p) => p.id === Number(id));

    if (index === -1) {
      throw new Error(`Producto con id ${id} no encontrado`);
    }

    const [deleted] = products.splice(index, 1);
    await this.#writeFile(products);

    return deleted;
  }
}
