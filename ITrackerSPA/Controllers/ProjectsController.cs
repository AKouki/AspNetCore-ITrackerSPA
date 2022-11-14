using ITrackerSPA.Data;
using ITrackerSPA.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ITrackerSPA.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ProjectsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProjectsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IEnumerable<Project>> Get()
        {
            var items = await _context.Projects
                .OrderByDescending(p => p.ProjectId)
                .ToListAsync();

            return items;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Details(int id)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null)
                return NotFound();

            return Ok(project);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Project project)
        {
            var newProject = new Project()
            {
                Name = project.Name,
                Url = project.Url,
                Description = project.Description,
                CreatedAt = DateTime.Now
            };

            _context.Projects.Add(newProject);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Edit(int id, [FromBody] Project project)
        {
            var projectToEdit = await _context.Projects.FindAsync(id);
            if (projectToEdit == null)
                return NotFound();

            projectToEdit.Name = project.Name;
            projectToEdit.Description = project.Description;
            projectToEdit.Url = project.Url;

            _context.Projects.Update(projectToEdit);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null)
                return NotFound();
            
            _context.Projects.Remove(project);
            _context.SaveChanges();
            return Ok();
        }

        [HttpGet("{id}/[action]")]
        public async Task<IEnumerable<Issue>> Issues(int id)
        {
            var items = await _context.Issues
                .Where(i => i.Project!.ProjectId == id)
                .OrderByDescending(i => i.IssueId)
                .ToListAsync();

            return items;
        }
    }
}
