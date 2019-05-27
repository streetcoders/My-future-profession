using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.Models
{
    public class Comment
    {
        

            public string AuthorsEmail { get; set; }
            public string MessageText { get; set; }

            public DateTime Date { get; set; }
        }
        public class Comment_Speciality
        {

        [BsonId]
        public ObjectId Id { get; set; }
        public string Code { get; set; }
            public string AuthorsEmail { get; set; }
        public string Name { get; set; }
        public bool HasImage { get; set; }
        public string Text { get; set; }

            public DateTime Date { get; set; }
        }
    
}