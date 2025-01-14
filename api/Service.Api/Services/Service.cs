using Akumina.Common.Entities.Taxonomy;
using Akumina.Logging;
using Microsoft.SharePoint.Client;
using Microsoft.SharePoint.Client.Taxonomy;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Akumina.Interchange.Services
{
    public class NCIService : BaseService
    {        
        public async Task<Dictionary<string, dynamic>> GetTermsFromTermSet(Guid termSetId)
        {
            var termsetData = new Dictionary<string, dynamic>();
            var results = new List<NCITermInfo>();
            try
            {
                //6.0 remove await / 6.2 use await
                using (ClientContext ctx = await GetClientContext())
                {
                    var taxonomySession = TaxonomySession.GetTaxonomySession(ctx);
                    var termStores = taxonomySession.TermStores;
                    ctx.Load(termStores);
                    await ctx.ExecuteQueryAsync("TermStoreService.GetTermsFromTermSet");

                    TermStore termStore = null;
                    if (termStores.Count == 1)
                    {
                        termStore = termStores[0];
                    }

                    if (termStore != null)
                    {
                        var siteCollectionGroup = termStore.GetSiteCollectionGroup(ctx.Site, true);

                        ctx.Load(termStore);
                        ctx.Load(siteCollectionGroup.TermSets);
                        await ctx.ExecuteQueryAsync("TermStoreService.GetTermsFromTermSet(2)");

                        // Fetch termset and its terms
                        var specificTermSet = termStore.GetTermSet(termSetId);
                        var allTermsInTermSet = specificTermSet.GetAllTerms();
                        ctx.Load(specificTermSet);
                        ctx.Load(allTermsInTermSet);
                        // Explicitly load Id, Name, PathOfTerm, SortOrder, Parent, and Labels
                        ctx.Load(allTermsInTermSet, t => t.Include(
                            u => u.Id,
                            u => u.Name,
                            u => u.PathOfTerm,
                            u => u.CustomSortOrder,
                            u => u.Parent.Id, // Ensure Parent.Id is included
                            u => u.Labels // Load Labels for the term
                        ));

                        await ctx.ExecuteQueryAsync("TermStoreService.GetTermsFromTermSet(3)");

                        var mappingTermSet = new MappingTermSet
                        {
                            Id = specificTermSet.Id,
                            Name = specificTermSet.Name
                        };

                        // Add termset info
                        termsetData.Add("termSet", mappingTermSet);

                        // Loop through all terms and add to results
                        foreach (var term in allTermsInTermSet)
                        {
                            var terminfo = GetTerminfo(term, allTermsInTermSet);

                            results.Add(terminfo);
                        }
                    }

                    // Go back through and add children
                    foreach (var item in results)
                    {
                        var children = results.Where(x => x.Parent != null && x.Parent.Id == item.Id);
                        if (children.Any())
                        {
                            item.Children = children.ToArray();
                        }
                    }

                    // Add terms
                    termsetData.Add("terms", results);
                }

                return termsetData;
            }
            catch (Exception ex)
            {
                TraceEvents.Log.Error(ex);
                throw;
            }
        }

        // Helper method to create TermInfo including labels and parent details
        private NCITermInfo GetTerminfo(Term term, TermCollection allTermsInTermSet)
        {
            var terminfo = new NCITermInfo
            {
                Id = term.Id,
                Name = term.Name,
                PathOfTerm = term.PathOfTerm,
                SortOrder = term.CustomSortOrder,
                Labels = term.Labels.Select(l => new NCITermLabelInfo
                {
                    Value = l.Value,
                    IsDefaultForLanguage = l.IsDefaultForLanguage,
                    Language = l.Language
                }).ToList()
            };

            if (term.LocalCustomProperties.Keys.Contains("_Sys_Nav_SimpleLinkUrl"))
            {
                terminfo.Url = term.LocalCustomProperties["_Sys_Nav_SimpleLinkUrl"];
            }

            // Handle parent term if available
            if (!term.IsRoot && term.Parent != null)
            {
                var parent = allTermsInTermSet.FirstOrDefault(t => t.Id == term.Parent.Id);
                if (parent != null)
                {
                    terminfo.Parent = new NCITermInfo
                    {
                        Name = parent.Name,
                        Id = parent.Id,
                        PathOfTerm = parent.PathOfTerm,
                        SortOrder = parent.CustomSortOrder
                    };
                }
            }

            return terminfo;
        }
    }

    // TermInfo class adjusted for labels
    public class NCITermInfo
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public NCITermInfo Parent { get; set; }

        public NCITermInfo[] Children { get; set; }

        public string Url { get; set; }

        public string PathOfTerm { get; set; }

        public string SortOrder { get; set; }

        public List<NCITermLabelInfo> Labels { get; set; } // Add Labels
    }

    // Label info class
    public class NCITermLabelInfo
    {
        public string Value { get; set; }
        public bool IsDefaultForLanguage { get; set; }
        public int Language { get; set; }
    }
}
