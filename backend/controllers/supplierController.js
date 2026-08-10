const supplierModel = require("../models/supplierModel");

const getSuppliers = async (req, res, next) => {
    try {
        const suppliers = await supplierModel.getAllSuppliers();

        res.status(200).json({
            success: true,
            data: suppliers
        });
    } catch (error) {
        next(error);
    }
};

const getSupplier = async (req, res, next) => {
    try {
        const { id } = req.params;

        const supplier = await supplierModel.getSupplierById(id);

        if (!supplier) {
            return res.status(404).json({
                success: false,
                message: "Supplier not found"
            });
        }

        res.status(200).json({
            success: true,
            data: supplier
        });
    } catch (error) {
        next(error);
    }
};

const createSupplier = async (req, res, next) => {
    try {
        const {
            name,
            contact_person,
            phone,
            email,
            address
        } = req.body;

        if (!name || name.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Supplier name is required"
            });
        }

        const supplierId = await supplierModel.createSupplier(
            name.trim(),
            contact_person || null,
            phone || null,
            email || null,
            address || null
        );

        const newSupplier =
            await supplierModel.getSupplierById(supplierId);

        res.status(201).json({
            success: true,
            message: "Supplier created successfully",
            data: newSupplier
        });
    } catch (error) {
        next(error);
    }
};

const updateSupplier = async (req, res, next) => {
    try {
        const { id } = req.params;

        const {
            name,
            contact_person,
            phone,
            email,
            address
        } = req.body;

        if (!name || name.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Supplier name is required"
            });
        }

        const existingSupplier =
            await supplierModel.getSupplierById(id);

        if (!existingSupplier) {
            return res.status(404).json({
                success: false,
                message: "Supplier not found"
            });
        }

        await supplierModel.updateSupplier(
            id,
            name.trim(),
            contact_person || null,
            phone || null,
            email || null,
            address || null
        );

        const updatedSupplier =
            await supplierModel.getSupplierById(id);

        res.status(200).json({
            success: true,
            message: "Supplier updated successfully",
            data: updatedSupplier
        });
    } catch (error) {
        next(error);
    }
};

const deleteSupplier = async (req, res, next) => {
    try {
        const { id } = req.params;

        const existingSupplier =
            await supplierModel.getSupplierById(id);

        if (!existingSupplier) {
            return res.status(404).json({
                success: false,
                message: "Supplier not found"
            });
        }

        await supplierModel.deleteSupplier(id);

        res.status(200).json({
            success: true,
            message: "Supplier deleted successfully"
        });
    } catch (error) {
         // MySQL foreign key constraint
            if (error.code === "ER_ROW_IS_REFERENCED_2") {
                return res.status(409).json({
                    success: false,
                    message:
                        "Cannot delete this supplier because it is currently being used by one or more products. Please reassign or remove those products first."
                });
            }
    }
};
 
         
module.exports = {
    getSuppliers,
    getSupplier,
    createSupplier,
    updateSupplier,
    deleteSupplier
};