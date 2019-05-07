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
        public ActionResult ChatRoom()
        {
            return View();
        }
        public ActionResult Chat()
        {
            return View();
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
                //string code = (string)Session["Speciality"];
                Speciality s = await dbSpec.GetSpecialityCode(code);
                List<Speciality_Subject> subjs = await dbSpec.GetSpecialitySubjs(code);
                List<Speciality_Proffesion> proffs = await dbSpec.GetSpecialityProffs(code);

                model = new ShowSpecialityModel {Code=s.Code, Name = s.Name, Introduction = s.Introduction, Content = s.Content, ImageId = s.ImageId, Link = s.Link };

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
        public async Task<ActionResult> ShowSpeciality(ShowSpecialityModel model)
        {
            return View(model);
        }
        public async Task<ActionResult> SpecialityList()
        {
            SpecialityListModel model = new SpecialityListModel();
            List<Speciality> specialities = await dbSpec.GetSpecialitiesAll();
            if (specialities != null)
            {
                model.Specialities = new Speciality[specialities.Count];
                for (int i = 0; i < specialities.Count; i++)
                {
                    model.Specialities[i] = specialities[i];
                }
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
        public async Task<ActionResult> AddSpeciality(AddSpecialityModel model,HttpPostedFileBase uploadedFile)
        {
            if (ModelState.IsValid)
            {
                Speciality spec = null;
                //user = db.Users.Find(new FilterDefinitionBuilder<User>().Regex("Email", new BsonRegularExpression(model.Email))).ToList()[0];

                spec = await dbSpec.GetSpecialityCode(model.Code);
                if (spec == null)
                {


                    await dbSpec.Create(new Speciality { Code = model.Code, Name = model.Name, Introduction = model.Introduction, Content = model.Content,Link=model.Link});
                    await dbSpec.CreateProff(model.Code, model.Jobs);
                    await dbSpec.CreateSubj(model.Code, model.Subjects);

                    if (uploadedFile != null)
                    {
                        await dbSpec.StoreImage(model.Code, uploadedFile.InputStream, uploadedFile.FileName);
                    }
                    return RedirectToAction("ShowSpeciality", "Home",new { code = model.Code });

                }
                else
                {
                    ModelState.AddModelError("", "UserSpeciality with this code is existing");
                }
            }
            
                return View(model);
        }
        public ActionResult About()
        {
            
            ViewBag.Message = "Your application description page.";

            return View();
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
                Speciality s = await dbSpec.GetSpecialityCode(code);
                var image = await dbSpec.GetImage(s.ImageId);
                if (image == null)
                {
                    return HttpNotFound();
                }
            
            return File(image, "image/png");
        }
    }
}