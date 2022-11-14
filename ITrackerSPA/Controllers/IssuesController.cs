using ITrackerSPA.Data;
using ITrackerSPA.Models.Enums;
using ITrackerSPA.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace ITrackerSPA.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class IssuesController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public IssuesController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IEnumerable<Issue>> Get()
        {
            var items = await _db.Issues
                .OrderByDescending(i => i.CreatedAt)
                .ToListAsync();

            return items;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Details(int id)
        {
            var issue = await _db.Issues.FindAsync(id);
            if (issue == null)
                return NotFound();

            return Ok(issue);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Issue issue)
        {
            // Validate enums
            if (!Enum.IsDefined(typeof(Priority), issue.Priority) ||
                !Enum.IsDefined(typeof(IssueType), issue.IssueType) ||
                !Enum.IsDefined(typeof(Status), issue.StatusType))
            {
                return BadRequest();
            }

            // A small trick. Do not tell anyone... :)
            var projectId = issue.IssueId;
            var project = _db.Projects.Where(p => p.ProjectId == projectId).FirstOrDefault();
            if (project == null)
                return NotFound();

            var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = _db.Users.Find(userId);
            try
            {
                // Create new issue
                var newIssue = new Issue()
                {
                    Title = issue.Title,
                    Description = issue.Description,
                    Priority = issue.Priority,
                    IssueType = issue.IssueType,
                    StatusType = issue.StatusType,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now,
                    Creator = user?.UserName,
                    Project = project
                };

                _db.Issues.Add(newIssue);
                await _db.SaveChangesAsync();

                // Fix for net::ERR_INCOMPLETE_CHUNKED_ENCODING
                newIssue.Project = null;

                return Ok(newIssue);
            }
            catch (DbUpdateException)
            {
                return BadRequest();
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Edit(int id, [FromBody] Issue issue)
        {
            var issueToEdit = await _db.Issues.FindAsync(id);
            if (issueToEdit == null)
                return NotFound();

            // Validate enums
            if (!Enum.IsDefined(typeof(Priority), issue.Priority) ||
                !Enum.IsDefined(typeof(IssueType), issue.IssueType) ||
                !Enum.IsDefined(typeof(Status), issue.StatusType))
            {
                return BadRequest();
            }

            // Only the fields we want to update
            issueToEdit.Title = issue.Title;
            issueToEdit.Priority = issue.Priority;
            issueToEdit.IssueType = issue.IssueType;
            issueToEdit.StatusType = issue.StatusType;
            issueToEdit.Description = issue.Description;

            _db.Issues.Update(issueToEdit);
            await _db.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var issue = await _db.Issues.FindAsync(id);
            if (issue == null)
                return NotFound();

            _db.Issues.Remove(issue);
            await _db.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("{id}/[action]")]
        public async Task<IEnumerable<Attachment>> Attachments(int id)
        {
            var items = await _db.Attachments
                .Include(a => a.Issue)
                .Where(i => i.Issue!.IssueId == id)
                .OrderByDescending(a => a.AttachmentId)
                .ToListAsync();

            return items;
        }
    }
}
