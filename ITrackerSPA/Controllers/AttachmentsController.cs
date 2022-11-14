using ITrackerSPA.Data;
using ITrackerSPA.Models;
using ITrackerSPA.Models.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ITrackerSPA.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AttachmentsController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly IWebHostEnvironment _env;

        public AttachmentsController(ApplicationDbContext db, IWebHostEnvironment env)
        {
            _db = db;
            _env = env;
        }

        [HttpGet]
        public async Task<IEnumerable<Attachment>> Get()
        {
            var items = await _db.Attachments
                .ToListAsync();

            return items;
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var attachment = await _db.Attachments.FindAsync(id);
            if (attachment == null)
                return NotFound();

            try
            {
                // Delete file from database
                _db.Attachments.Remove(attachment);
                await _db.SaveChangesAsync();

                // Delete file from disk
                if (!string.IsNullOrWhiteSpace(attachment.Path))
                {
                    var filePath = Path.Combine(_env.WebRootPath, attachment.Path);
                    if (System.IO.File.Exists(filePath))
                        System.IO.File.Delete(filePath);
                }

                return Ok();
            }
            catch (DbUpdateException)
            {
                return BadRequest();
            }
        }

        [HttpPut("[action]/{issueId}")]
        public async Task<IActionResult> Upload(int issueId, IFormFile file)
        {
            // Get issue to map the attachment
            var issue = await _db.Issues.FindAsync(issueId);
            if (issue == null)
                return NotFound();

            // Basic validation
            if (!IsValidFile(file))
                return BadRequest();

            // Save file
            var fileName = Path.GetFileNameWithoutExtension(file.FileName) + "_" +
                DateTime.Now.ToString("yyyyMMddHHmmss") +
                Path.GetExtension(file.FileName);

            var filePath = Path.Combine(_env.WebRootPath, fileName);
            using var fs = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(fs);

            // Save file record to db
            Attachment attachment = new Attachment()
            {
                Name = Path.GetFileNameWithoutExtension(file.FileName),
                CreatedAt = DateTime.Now,
                Path = fileName,
                FileType = GetFileType(file),
                Issue = issue
            };
            _db.Attachments.Add(attachment);
            await _db.SaveChangesAsync();

            return Ok();
        }

        private FileType GetFileType(IFormFile file)
        {
            string[] allowedExtensions = { "png", "jpg", "jpeg" };
            var fileExtension = Path.GetExtension(file.FileName);
            if (allowedExtensions.Any(e => fileExtension.Contains(e)))
                return FileType.Image;

            return FileType.Document;
        }

        private bool IsValidFile(IFormFile file)
        {
            string[] allowedExtensions = { "png", "jpg", "jpeg", "pdf", "doc", "docx" };
            string fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();

            // Invalid file
            if (file == null || file.Length == 0)
                return false;

            // Maximum file size allowed: 500kb
            if (file.Length > 512000)
                return false;

            // Only the above file extensions are allowed
            if (!allowedExtensions.Any(e => fileExtension.Contains(e)))
                return false;

            if (file.FileName.Length > 255)
                return false;

            return true;
        }
    }
}
