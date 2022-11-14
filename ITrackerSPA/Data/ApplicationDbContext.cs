using Duende.IdentityServer.EntityFramework.Options;
using ITrackerSPA.Models;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace ITrackerSPA.Data
{
    public class ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions options, IOptions<OperationalStoreOptions> operationalStoreOptions)
            : base(options, operationalStoreOptions)
        {

        }

        public DbSet<Project> Projects { get; set; }
        public DbSet<Issue> Issues { get; set; }
        public DbSet<Attachment> Attachments { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Project>()
                        .HasMany(i => i.Issues)
                        .WithOne(b => b.Project)
                        .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Issue>()
                        .HasMany(i => i.Attachments)
                        .WithOne(a => a.Issue)
                        .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Project>().ToTable("Projects");
            builder.Entity<Issue>().ToTable("Issues");
            builder.Entity<Attachment>().ToTable("Attachments");
        }
    }
}