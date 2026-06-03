import {
    getAllCategories,
    getCategoriesByProjectId,
    updateCategoryAssignments
} from '../models/categories.js';

import {
    getProjectDetails
} from '../models/projects.js';

const showCategoriesPage = async (req, res) => {
    const categories =
        await getAllCategories();

    res.render('categories', {
        title: 'Service Project Categories',
        categories,
        year: new Date().getFullYear()
    });
};

const showAssignCategoriesForm = async (
    req,
    res
) => {

    const projectId =
        req.params.projectId;

    const projectDetails =
        await getProjectDetails(projectId);

    const categories =
        await getAllCategories();

    const assignedCategories =
        await getCategoriesByProjectId(projectId);

    res.render('assign-categories', {
        title: 'Assign Categories to Project',
        projectId,
        projectDetails,
        categories,
        assignedCategories
    });
};

const processAssignCategoriesForm = async (
    req,
    res
) => {

    const projectId =
        req.params.projectId;

    const selectedCategoryIds =
        req.body.categoryIds || [];

    const categoryIdsArray =
        Array.isArray(selectedCategoryIds)
            ? selectedCategoryIds
            : [selectedCategoryIds];

    await updateCategoryAssignments(
        projectId,
        categoryIdsArray
    );

    req.flash(
        'success',
        'Categories updated successfully.'
    );

    res.redirect(
        `/project/${projectId}`
    );
};

export {
    showCategoriesPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm
};