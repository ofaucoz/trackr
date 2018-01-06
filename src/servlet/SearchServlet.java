package servlet;

import static org.apache.commons.lang3.StringEscapeUtils.escapeHtml4;

import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.hibernate.Session;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

import ressources.SFactory;
import ressources.Tweet;
import ressources.TwitterBuilder;
import ressources.User;

/**
 * Servlet implementation class Auth
 */
@WebServlet("search")
public class SearchServlet extends HttpServlet implements Servlet {
	/**
	 * Servlet used to search for hashtag or location within Twitter API
	 */
	
	private static final long serialVersionUID = 2L;
	
	/**
	 * Constructor
	 */
	public SearchServlet() {
		super();
	}

	@Override
	public void init() throws ServletException {
		super.init();
	}
	
	/**
	 * Get query that will build the url depending of the parameters and then ask TwitterBuilder for getting Tweet objects
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setCharacterEncoding("UTF-8");
		PrintWriter out = response.getWriter();
		Session session = SFactory.getSession();
		List<Tweet> listTweet = new ArrayList<Tweet>();
		String hashtag = request.getParameter("hashtag");
		String latitude = request.getParameter("latitude");
		String longitude = request.getParameter("longitude");
		String radius = request.getParameter("radius");
		String date = request.getParameter("date");
		String url = "https://api.twitter.com/1.1/search/tweets.json?";
		System.out.println("hashtag is " + hashtag);
		System.out.println("latitude is " + latitude);
		System.out.println("longitude is " + longitude);
		System.out.println("radius is " + radius);
		System.out.println("date is " + date);
		if(hashtag != null) {
			url += "q=" + hashtag;
		}
		if(latitude!=null&&longitude!=null&&radius!=null) {
			url += "&geocode=" + latitude + "," + longitude + "," + "1mi";
		}
		if(date != null) {
			url += "&until=" + date;
		}
		System.out.println(url);
		//url += ("&count=100" + "&result_type=recent"); //request 100 (max possible) of the most recent matching tweets - need to change geocoding API before this is feasible
		TwitterBuilder twitterBuilder = new TwitterBuilder();
		ObjectMapper objectMapper = new ObjectMapper();
		listTweet = twitterBuilder.queryAndCreate(url, session);
		objectMapper.enable(SerializationFeature.INDENT_OUTPUT);
		out.println(objectMapper.writeValueAsString(listTweet));	
		session.close();
	}
	/**
	 * Since it's not useful, it's just a mirror to the doGet()
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doGet(request, response);
	}

}
