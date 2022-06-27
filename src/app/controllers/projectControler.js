const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const Project = require('../models/project');


router.use(authMiddleware);

router.get('/', async (req, res) => {
    try{
        const testado = req.userId;
        const projects = await Project.find({user: testado}).populate(['user']);
        return res.send({ projects });
    } catch (err) {
        return res.status(400).send({ error: 'Error loading projects'});
    }
});
router.get('/:projectId', async (req, res) => {
    try{
        const project = await Project.findById(req.params.projectId).populate(['user'])
            .select('+user');
        return res.send({ project });
    } catch (err) {
        return res.status(400).send({ error: 'Error loading project'});
    }
});
router.post('/', async (req, res) => {
    try{
        const { title, description, begin, end} = req.body;

        const project = await Project.create({ title, description, user: req.userId, begin, end });

        await project.save();

        return res.send({ project });
    } catch (err) {
        return res.status(400).send({ error: 'Error creating new project'});
    }
});
router.put('/:projectId', async (req, res) => {
    try{
        const { title, description, begin, end} = req.body;

        const project = await Project.findByIdAndUpdate(req.params.projectId, { title, description, user: req.userId, begin, end }, {new: true });

        return res.send({ project });
    } catch (err) {
        return res.status(400).send({ error: 'Error updating  project'});
    }
});
router.delete('/:projectId', async (req, res) => {
    try{
        await Project.findByIdAndRemove(req.params.projectId);

        return res.send();
    } catch (err) {
        return res.status(400).send({ error: 'Error deleting project'});
    }
});
module.exports = app => app.use('/projects', router);