package ressources;

import java.nio.file.Paths;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

public class SFactory {
	public static Session getSession(){
		SessionFactory factory = null;
		try{
	         factory = new Configuration().configure().buildSessionFactory();
		}catch (Throwable ex) { 
			System.err.println("Failed to create sessionFactory object." + ex);
			throw new ExceptionInInitializerError(ex); 
		}
		return factory.openSession();
		
	}
}