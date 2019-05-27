using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    public class HomeController : Controller
    {
        private readonly UserContext db = new UserContext();
        private readonly SpecialityContext dbSpec = new SpecialityContext();
        public ActionResult Index()
        {
            return View();
        }
        public async Task<ActionResult> StartQuest(string id)
        {

            Quest_Speciality q = await dbSpec.GetQuest(id);
            CreateQuestModel model = new CreateQuestModel { Code = q.Code, Id = q.Id, QuestText = q.QuestText };
            return View(model);
        }
        public ActionResult QuestLevel1()
        {
            return View();
        }
        public ActionResult QuestLevel2()
        {
            return View();
        }
        public ActionResult QuestLevel3()
        {
            return View();
        }
        public ActionResult QuestLevel4()
        {
            return View();
        }
        public ActionResult FinalPage()
        {
            return View();
        }
        public async Task<ActionResult> QuestList(string code)
        {
            if (code.Length == 2)
            {
                code = '0' + code;
            }
            List<Quest_Speciality> qs = await dbSpec.GetQuests(code);
            QuestListModel model = new QuestListModel { Code = code };
            if (qs != null)
            {
                model.Quests = new Quest_Speciality[qs.Count];
                model.Quests = qs.ToArray();

            }
            return View(model);
        }
        public ActionResult Level1(string code)
        {
            if (code[0] == '0')
            {
                code = code.Substring(1);
            }
            return View(new CreateQuestModel { Code = code });
        }
        public ActionResult Level2(string code)
        {
            if (code[0] == '0')
            {
                code = code.Substring(1);
            }
            return View(new CreateQuestModel { Code = code });
        }
        public ActionResult Level3(string code)
        {
            if (code[0] == '0')
            {
                code = code.Substring(1);
            }
            return View(new CreateQuestModel { Code = code });
        }
        public ActionResult Level4(string code)
        {
            if (code[0] == '0')
            {
                code = code.Substring(1);
            }
            return View(new CreateQuestModel { Code = code });
        }
        public async Task<ActionResult> Chat()
        {
            User u = await db.GetUserE(User.Identity.Name);
            return View(u);
        }
        public ActionResult Speciality()
        {
            return View();
        }
        [HttpPost]
        public async Task<ActionResult> Speciality(ShowSpecialityModel model)
        {
            return View(model);
        }


        public async Task<ActionResult> ShowSpeciality(string code)
        {
            ShowSpecialityModel model = null;
            Speciality s = await dbSpec.GetSpecialityCode(code);
            List<Speciality_Subject> subjs = await dbSpec.GetSpecialitySubjs(code);
            List<Speciality_Proffesion> proffs = await dbSpec.GetSpecialityProffs(code);
            List<Comment_Speciality> comms = await dbSpec.GetComments(code);
            if (code[0] == '0')
            {
                code = code.Substring(1);
            }
            model = new ShowSpecialityModel { Code = code, Name = s.Name, Introduction = s.Introduction, Content = s.Content, ImageId = s.ImageId, Link = s.Link };

            if (subjs != null)
            {
                model.Subjects = new string[subjs.Count];
                for (int i = 0; i < subjs.Count; i++)
                {
                    model.Subjects[i] = subjs[i].Subject;
                }
            }
            if (proffs != null)
            {
                model.Jobs = new string[proffs.Count];
                for (int i = 0; i < proffs.Count; i++)
                {
                    model.Jobs[i] = proffs[i].Proffesion;
                }

            }
            if (comms != null)
            {
                comms.Reverse();
                model.Comments = comms.ToArray();
                for (int i = 0; i < model.Comments.Length; i++)
                {
                    model.Comments[i].HasImage = (await db.GetUserE(model.Comments[i].AuthorsEmail)).HasImage();
                    model.Comments[i].Name = (await db.GetUserE(model.Comments[i].AuthorsEmail)).Name;
                }

            }

            model.Likes = dbSpec.GetLikesCount(code);
            return View(model);
        }
        public async Task<ActionResult> SendComment(string code, ShowSpecialityModel model)
        {
            if (code.Length == 2)
            {
                code = '0' + code;
            }
            if (ModelState.IsValid)
            {
                await dbSpec.CreateComment(new Comment_Speciality { AuthorsEmail = User.Identity.Name, Text = model.NewComment, Date = DateTime.UtcNow, Code = code });
                return RedirectToAction("ShowSpeciality", "Home", new { code });

            }
            return View(model);
        }
        public async Task<ActionResult> SpecialityList()
        {
            SpecialityListModel model = new SpecialityListModel();
            List<Speciality> specialities = await dbSpec.GetSpecialitiesAll();
            specialities.Sort(new SortSpec());
            if (specialities != null)
            {
                model.Specialities = specialities.ToArray();
            }
            return View(model);
        }

        [HttpPost]
        public async Task<ActionResult> SpecialityList(SpecialityListModel model)
        {
            return View(model);
        }
        public ActionResult AddSpeciality()
        {
            return View();
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> AddSpeciality(AddSpecialityModel model, HttpPostedFileBase uploadedFile)
        {
            if (ModelState.IsValid)
            {
                Speciality spec = null;
                //user = db.Users.Find(new FilterDefinitionBuilder<User>().Regex("Email", new BsonRegularExpression(model.Email))).ToList()[0];

                spec = await dbSpec.GetSpecialityCode(model.Code);
                if (spec == null)
                {


                    await dbSpec.Create(new Speciality { Code = model.Code, Name = model.Name, Introduction = model.Introduction, Content = model.Content, Link = model.Link });
                    await dbSpec.CreateProff(model.Code, model.Jobs);
                    await dbSpec.CreateSubj(model.Code, model.Subjects);

                    if (uploadedFile != null)
                    {
                        await dbSpec.StoreImage(model.Code, uploadedFile.InputStream, uploadedFile.FileName);
                    }
                    return RedirectToAction("ShowSpeciality", "Home", new { code = model.Code });

                }
                else
                {
                    ModelState.AddModelError("", "UserSpeciality with this code is existing");
                }
            }

            return View(model);
        }

        public async Task<ActionResult> EditSpeciality(string code)
        {

            Speciality s = await dbSpec.GetSpecialityCode(code);
            List<Speciality_Subject> subjs = await dbSpec.GetSpecialitySubjs(code);
            List<Speciality_Proffesion> proffs = await dbSpec.GetSpecialityProffs(code);


            EditSpecialityModel model = new EditSpecialityModel { Name = s.Name, Id = s.Id, Introduction = s.Introduction, Content = s.Content, Link = s.Link, Code = s.Code };

            if (subjs != null)
            {
                model.Subjects = new string[subjs.Count];
                for (int i = 0; i < subjs.Count; i++)
                {
                    model.Subjects[i] = subjs[i].Subject;
                }
            }
            if (proffs != null)
            {
                model.Jobs = new string[proffs.Count];
                for (int i = 0; i < proffs.Count; i++)
                {
                    model.Jobs[i] = proffs[i].Proffesion;
                }

            }
            return View(model);
        }
        [HttpPost]
        public async Task<ActionResult> EditSpeciality(string code, EditSpecialityModel model, HttpPostedFileBase uploadedFile)
        {
            Speciality s = await dbSpec.GetSpecialityCode(code);
            if (ModelState.IsValid && Session["IsAdmin"] != null && (bool)Session["IsAdmin"] == true)
            {
                await dbSpec.Update(new Speciality { Id = s.Id, Code = code, Name = model.Name, Introduction = model.Introduction, Content = model.Content, Link = model.Link, ImageId = s.ImageId });
                await dbSpec.RemoveJobs(code);
                await dbSpec.RemoveSubjects(code);
                await dbSpec.CreateProff(code, model.Jobs);
                await dbSpec.CreateSubj(code, model.Subjects);

                if (uploadedFile != null)
                {
                    await dbSpec.StoreImage(code, uploadedFile.InputStream, uploadedFile.FileName);
                }
                return RedirectToAction("ShowSpeciality", "Home", new { code });

            }

            return View(model);
        }
        public ActionResult About()
        {

            ViewBag.Message = "Your application description page.";

            return View();
        }
        public ActionResult GeneralConstructor(string code)
        {
            if (code[0].Equals('0'))
            {
                code = code.Substring(1);
            }
            return View(new CreateQuestModel { Code = code });
        }
        public ActionResult CreateQuest(string code, string result)
        {
            if (code.Length == 2)
            {
                code = '0' + code;
            }
            dbSpec.CreateQuest(new Quest_Speciality { Code = code, QuestText = result });
            return RedirectToAction("ShowSpeciality", new { code });
        }
        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
        public ActionResult Feedback()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Feedback(FeedbackModel model)
        {
            if (ModelState.IsValid)
            {
                MailAddress from = new MailAddress("streetcoders.helper@gmail.com", model.Email);
                MailAddress to = new MailAddress("streetcoders.helper@gmail.com");
                MailMessage m = new MailMessage(from, to);
                m.Subject = "Feedback";
                m.Body = model.Message;
                SmtpClient smtp = new SmtpClient("smtp.gmail.com", 587);
                smtp.Credentials = new NetworkCredential("streetcoders.helper@gmail.com", "best_team_ever2019_top");
                smtp.EnableSsl = true;
                await smtp.SendMailAsync(m);
                from = new MailAddress("streetcoders.helper@gmail.com", "Street Coders");
                to = new MailAddress(model.Email);
                m = new MailMessage(from, to);
                m.Subject = "Feedback";
                m.Body = "Добрий день, ваше повідомлення отримано і буде оброблено протягом трьох днів.";
                smtp.Credentials = new NetworkCredential("streetcoders.helper@gmail.com", "best_team_ever2019_top");
                smtp.EnableSsl = true;
                await smtp.SendMailAsync(m);
            }
            return View(model);
        }
        public async Task<ActionResult> GetImage(string code)
        {
            if (code.Length == 2)
            {
                code = '0' + code;
            }
            Speciality s = await dbSpec.GetSpecialityCode(code);
            var image = await dbSpec.GetImage(s.ImageId);
            if (image == null)
            {
                return HttpNotFound();
            }

            return File(image, "image/png");
        }
        public async Task<ActionResult> RemoveComment(string id, string Code)
        {

            if (Code.Length == 2)
            {
                Code = '0' + Code;
            }
            await dbSpec.RemoveComment(id);
            return RedirectToAction("ShowSpeciality", new { code = Code });
        }
        public async Task<ActionResult> RemoveSpeciality(string code)
        {

            await dbSpec.Remove(code);
            return RedirectToAction("SpecialityList");
        }
        public async Task<ActionResult> RemoveQuest(string id, string code)
        {

            if (code.Length == 2)
            {
                code = '0' + code;
            }
            await dbSpec.RemoveQuest(id);
            return RedirectToAction("QuestList", new { code });
        }

        public ActionResult LikePartial(string code)
        {
            if (code.Length == 2)
            {
                code = '0' + code;
            }
            long count = dbSpec.GetLikesCount(code);
            //long count = 15;

            LikeModel model = new LikeModel { Code = code, Count = count };
            return PartialView(model);
        }
        public async Task<ActionResult> Like(string code)
        {
            if (code.Length == 2)
            {
                code = '0' + code;
            }
            //await dbSpec.CreateLike(new Like { Code = code, User = User.Identity.Name });
            if (await dbSpec.GetLikeUser(code, User.Identity.Name))
            {
                await dbSpec.RemoveLike(code, User.Identity.Name);

            }
            else
            {
                await dbSpec.CreateLike(new Like { Code = code, User = User.Identity.Name });

            }
            long count = dbSpec.GetLikesCount(code);


            LikeModel model = new LikeModel { Code = code, Count = count };
            return RedirectToAction("ShowSpeciality", new { code });
        }
    }
}