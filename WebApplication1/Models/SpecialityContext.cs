using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.GridFS;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Authentication;
using System.Threading.Tasks;
using System.Web;

namespace WebApplication1.Models
{
    public class SpecialityContext
    {
        IMongoDatabase database; // база данных
        IGridFSBucket gridFS;   // файловое хранилище

        public SpecialityContext()
        {
            string connectionString =
         @"mongodb://codcorp:S9W0YWeJ5CAk0ujLjfaLcz5pVNINavjSGvzeLYqZrSVhU5dV7ScIACcpy4rRd627TSc6zQ4mZYqSZ2uFw9gYMw==@codcorp.documents.azure.com:10255/?ssl=true&replicaSet=globaldb";
            connectionString = "mongodb://localhost:27017";
            MongoClientSettings settings = MongoClientSettings.FromUrl(
              new MongoUrl(connectionString)
            );
            settings.SslSettings =
              new SslSettings() { EnabledSslProtocols = SslProtocols.Tls12 };
            var mongoClient = new MongoClient(settings);
            //var connection = new MongoUrlBuilder(connectionString);
            // получаем клиента для взаимодействия с базой данных
            MongoClient client = new MongoClient(connectionString);

            database = client.GetDatabase("test");
            // получаем доступ к файловому хранилищу
            gridFS = new GridFSBucket(database);
        }
        public IMongoCollection<Speciality> Specialities
        {
            get { return database.GetCollection<Speciality>("Specialities"); }
        }


        public IMongoCollection<Speciality_Subject> Specialities_Subjects
        {
            get { return database.GetCollection<Speciality_Subject>("Specialities_Subjects"); }
        }


        public IMongoCollection<Speciality_Proffesion> Specialities_Proffesions
        {
            get { return database.GetCollection<Speciality_Proffesion>("Specialities_Proffesions"); }
        }

        public async Task CreateSubj(string code,string[] subj)
        {
            for(int i=0;i<subj.Length;i++)
            await Specialities_Subjects.InsertOneAsync(new Speciality_Subject{ Code = code,Subject=subj[i] });
        }
        public async Task CreateProff(string code, string[] proff)
        {
            for (int i = 0; i < proff.Length; i++)
                await Specialities_Proffesions.InsertOneAsync(new Speciality_Proffesion { Code = code, Proffesion = proff[i] });
        }

        public async Task<List<Speciality_Subject>> GetSpecialitySubjs(string code)
        {

            List<Speciality_Subject> results = null;
            var filter = new BsonDocument("Code", new BsonDocument("$eq", code));
            results = await Specialities_Subjects.Find<Speciality_Subject>(filter).ToListAsync();
            if (results != null)
                return results;
            else return null;
        }
        public async Task<List<Speciality_Proffesion>> GetSpecialityProffs(string code)
        {

            List<Speciality_Proffesion> results = null;
            var filter = new BsonDocument("Code", new BsonDocument("$eq", code));
            results = await Specialities_Proffesions.Find<Speciality_Proffesion>(filter).ToListAsync();
            if (results != null)
                return results;
            else return null;
        }
        /*public async Task<User> GetUsersAsync(string email, string pass)
        {

            List<User> results = null;
            var filter = new BsonDocument("$and", new BsonArray{

             new BsonDocument("Email",new BsonDocument("$eq", email)),
             new BsonDocument("Password", pass)
            });
            results = await Users.Find<User>(filter).ToListAsync();
            if (results != null)
                return results.FirstOrDefault();
            else return null;
        }*/

        // получаем один документ по id
        /*public async Task<User> GetUser(string id)
        {
            return await Users.Find(new BsonDocument("_id", new ObjectId(id))).FirstOrDefaultAsync();
        }*/
        public async Task<Speciality> GetSpecialityCode(string code)
        {

            List<Speciality> results = null;
            var filter = new BsonDocument("Code", new BsonDocument("$eq", code));
            results = await Specialities.Find<Speciality>(filter).ToListAsync();
            if (results != null)
                return results.FirstOrDefault();
            else return null;
        }
        // добавление документа
        public async Task Create(Speciality s)
        {
            await Specialities.InsertOneAsync(s);
        }
        // обновление документа
        public async Task Update(Speciality s)
        {

            var filter = new BsonDocument("Code", new BsonDocument("$eq", s.Code));
            await Specialities.ReplaceOneAsync(filter, s);
        }
        // удаление документа
        public async Task Remove(string code)
        {
            var filter = new BsonDocument("Code", new BsonDocument("$eq", code));
            await Specialities.DeleteOneAsync(filter);
        }
        // получение изображения
        public async Task<byte[]> GetImage(string id)
        {
            return await gridFS.DownloadAsBytesAsync(new ObjectId(id));
        }
        // сохранение изображения
        public async Task StoreImage(string code, Stream imageStream, string imageName)
        {
            Speciality s = await GetSpecialityCode(code);
            if(s.ImageId!=null)
                await gridFS.DeleteAsync(new ObjectId(s.ImageId));
            
            // сохраняем изображение
            ObjectId imageId = await gridFS.UploadFromStreamAsync(imageName, imageStream);
            // обновляем данные по документу
            s.ImageId = imageId.ToString();
            var filter = Builders<Speciality>.Filter.Eq("Code", s.Code);
            var update = Builders<Speciality>.Update.Set("ImageId", s.ImageId);
            await Specialities.UpdateOneAsync(filter, update);
        }
        /*public async Task UpdateName(string email, string newName)
        {
            var filter = Builders<User>.Filter.Eq("Email", email);
            var update = Builders<User>.Update.Set("Name", newName);
            await Users.UpdateOneAsync(filter, update);
        }*/

    }
}